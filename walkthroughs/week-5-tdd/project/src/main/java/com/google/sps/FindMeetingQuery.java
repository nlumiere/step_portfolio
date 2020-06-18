// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.Collection;
import java.util.ArrayList;
import java.util.Set;

public final class FindMeetingQuery {

    int WHOLE_DAY_LENGTH = 1440;

    // Only works with sorted, non-overlapping time ranges
    // checkTimes prepares data
    private Collection<TimeRange> invert(Collection<TimeRange> bookedTimes, long requestDuration){
        Collection<TimeRange> possibleTimes = new ArrayList<TimeRange>();
        int firstTime = 0;
        for(TimeRange tr : bookedTimes){
            TimeRange free = TimeRange.fromStartEnd(firstTime, tr.start(), false);

            // Ensures a meeting ending before the endpoint of a previous meeting cannot allow
            // an invalid meeting to be scheduled
            firstTime = tr.end();

            if(free.duration() >= requestDuration)
                possibleTimes.add(free);
        }
        TimeRange endOfDay = TimeRange.fromStartEnd(firstTime, WHOLE_DAY_LENGTH, false);
        if(endOfDay.duration() >= requestDuration){
            possibleTimes.add(endOfDay);
        }
        
        return possibleTimes;
    }

    // This method doesn't seem efficient. I'd appreciate suggestions
    // TODO: Refactor for efficiency
    private ArrayList<TimeRange> checkTimes(Collection<Event> events, 
        MeetingRequest request, boolean optionalCheck){

        ArrayList<TimeRange> bookedTimes = new ArrayList<TimeRange>();
        for(Event e : events){
            //Adds the time slot to booked times if it pertains to request people
            Set<String> people = e.getAttendees();
            for(String person : people){
                if(request.getAttendees().contains(person) || 
                    (request.getOptionalAttendees().contains(person) && optionalCheck)){
                    
                    boolean overlap = false;
                    for(int ii = 0; ii < bookedTimes.size(); ii++){
                        TimeRange bt = bookedTimes.get(ii);
                        if(bt.overlaps(e.getWhen()) || bt.end() == e.getWhen().start() || 
                            bt.start() == e.getWhen().end()){
                            overlap = true;
                            TimeRange newTime = 
                                TimeRange.fromStartEnd(Math.min(e.getWhen().start(), bt.start()),
                                Math.max(e.getWhen().end(), bt.end()), false);
                            bookedTimes.set(ii, newTime);
                        }
                    }
                    if(!overlap){
                        TimeRange newTime = e.getWhen();
                        TimeRange temp;
                        // Sorts meeting by start time
                        // Can't have overlap
                        for(int ii = 0; ii < bookedTimes.size(); ii++){
                            TimeRange bt = bookedTimes.get(ii);
                            if(newTime.start() < bt.start()){
                                temp = bt;
                                bookedTimes.set(ii, newTime);
                                newTime = temp;
                            }
                        }
                        bookedTimes.add(newTime);
                    }
                    break;
                }
            }
        }
        return bookedTimes;
    }

    //Expects sorted Collection
    public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
        ArrayList<TimeRange> bookedTimes = new ArrayList<TimeRange>();
        Collection<TimeRange> possibleTimes;
        
        //Checks to ensure valid MeetingRequest duration
        if(request.getDuration() > TimeRange.WHOLE_DAY.duration())
            return new ArrayList<TimeRange>();

        //Checks for mandatory and optional attendees
        bookedTimes = checkTimes(events, request, true);

        possibleTimes = invert(bookedTimes, request.getDuration());

        // If there are no possible times, checks only for mandatory attendees
        if(possibleTimes.isEmpty() && !request.getOptionalAttendees().isEmpty() 
            && !request.getAttendees().isEmpty()){
            bookedTimes = checkTimes(events, request, false);
            possibleTimes = invert(bookedTimes, request.getDuration());
        }

        return possibleTimes;
    }
}
