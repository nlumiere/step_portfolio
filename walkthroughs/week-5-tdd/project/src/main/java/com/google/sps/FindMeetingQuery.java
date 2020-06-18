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
import java.util.Collections;
import java.util.Comparator;
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

        // Gets all time ranges
        for(Event e : events){
            //Adds the time slot to booked times if it pertains to request people
            Set<String> people = e.getAttendees();
            for(String person : people){
                if(request.getAttendees().contains(person) || 
                    (request.getOptionalAttendees().contains(person) && optionalCheck)){

                    bookedTimes.add(e.getWhen());
                }
            }
        }
        // Sorts unavailable time slots by start time
        Collections.sort(bookedTimes, new TimeRangeCompare());

        //Merges overlapping time slots into one longer time slot
        int ii = 0;
        while(ii < bookedTimes.size() - 1){
            if(bookedTimes.get(ii).overlaps(bookedTimes.get(ii+1))){
                TimeRange tr = TimeRange.fromStartEnd(bookedTimes.get(ii).start(), 
                    Math.max(bookedTimes.get(ii).end(), bookedTimes.get(ii+1).end()), false);
                bookedTimes.set(ii, tr);
                bookedTimes.remove(ii+1);
            }
            else{
                ii++;
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

// Comparator class for Collections.sort to use to compare TimeRange objects
class TimeRangeCompare implements Comparator<TimeRange>{

    @Override
    public int compare(TimeRange tr1, TimeRange tr2){
        return Integer.compare(tr1.start(), tr2.start());
    }
}
