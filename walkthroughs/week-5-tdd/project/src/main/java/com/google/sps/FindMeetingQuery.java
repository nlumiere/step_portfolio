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

    // Only works with sorted, non-overlapping time ranges
    // checkTimes prepares data
    private Collection<TimeRange> invert(Collection<TimeRange> booked_times, long requestDuration){
        Collection<TimeRange> possible_times = new ArrayList<TimeRange>();
        int firstTime = 0;
        for(TimeRange tr : booked_times){
            TimeRange free = TimeRange.fromStartEnd(firstTime, tr.start(), false);

            // Ensures a meeting ending before the endpoint of a previous meeting cannot allow
            // an invalid meeting to be scheduled
            if(tr.start() + tr.duration() > firstTime)
                firstTime = tr.start() + tr.duration();

            if(free.duration() >= requestDuration)
                possible_times.add(free);
        }
        TimeRange endOfDay = TimeRange.fromStartEnd(firstTime, 1440, false);
        if(endOfDay.duration() >= requestDuration){
            possible_times.add(endOfDay);
        }
        
        return possible_times;
    }

    // This method doesn't seem efficient. I'd appreciate suggestions
    // TODO: Refactor for efficiency
    private ArrayList<TimeRange> checkTimes(Collection<Event> events, 
        MeetingRequest request, boolean optionalCheck){

        ArrayList<TimeRange> booked_times = new ArrayList<TimeRange>();
        for(Event e : events){
            //Adds the time slot to booked times if it pertains to request people
            Set<String> people = e.getAttendees();
            for(String person : people){
                if(request.getAttendees().contains(person) || 
                    (request.getOptionalAttendees().contains(person) && optionalCheck)){
                    
                    boolean overlap = false;
                    for(int ii = 0; ii < booked_times.size(); ii++){
                        TimeRange bt = booked_times.get(ii);
                        if(bt.overlaps(e.getWhen()) || bt.end() == e.getWhen().start() || 
                            bt.start() == e.getWhen().end()){
                            overlap = true;
                            TimeRange newTime = 
                                TimeRange.fromStartEnd(Math.min(e.getWhen().start(), bt.start()),
                                Math.max(e.getWhen().end(), bt.end()), false);
                            booked_times.set(ii, newTime);
                        }
                    }
                    if(!overlap){
                        TimeRange newTime = e.getWhen();
                        TimeRange temp;
                        // Sorts meeting by start time
                        // Can't have overlap
                        for(int ii = 0; ii < booked_times.size(); ii++){
                            TimeRange bt = booked_times.get(ii);
                            if(newTime.start() < bt.start()){
                                temp = bt;
                                booked_times.set(ii, newTime);
                                newTime = temp;
                            }
                        }
                        booked_times.add(newTime);
                    }
                    break;
                }
            }
        }
        return booked_times;
    }

    //Expects sorted Collection
    public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
        ArrayList<TimeRange> booked_times = new ArrayList<TimeRange>();
        Collection<TimeRange> possible_times;
        
        //Checks to ensure valid MeetingRequest duration
        if(request.getDuration() > TimeRange.WHOLE_DAY.duration())
            return new ArrayList<TimeRange>();

        booked_times = checkTimes(events, request, true);

        if(booked_times.isEmpty()){
            possible_times = new ArrayList<TimeRange>();
            possible_times.add(TimeRange.WHOLE_DAY);
            return possible_times;
        }
    
        possible_times = invert(booked_times, request.getDuration());

        if(possible_times.isEmpty() && !request.getOptionalAttendees().isEmpty() 
            && !request.getAttendees().isEmpty()){
            booked_times = checkTimes(events, request, false);
        }

        possible_times = invert(booked_times, request.getDuration());

        return possible_times;
    }
}
