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

    //Expects sorted Collection
    public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
        Collection<TimeRange> booked_times = new ArrayList<TimeRange>();
        Collection<TimeRange> possible_times;
        
        //Checks to ensure valid MeetingRequest duration
        if(request.getDuration() > TimeRange.WHOLE_DAY.duration())
            return new ArrayList<TimeRange>();

        for(Event e : events){
            //Returns empty collection if an event is invalid duration
            if(e.getWhen().duration() > TimeRange.WHOLE_DAY.duration())
                return new ArrayList<TimeRange>();
            
            //Adds the time slot to booked times if it pertains to request people
            Set<String> people = e.getAttendees();
            for(String person : people){
                if(request.getAttendees().contains(person))
                    booked_times.add(e.getWhen());
            }
        }
        if(booked_times.isEmpty()){
            possible_times = new ArrayList<TimeRange>();
            possible_times.add(TimeRange.WHOLE_DAY);
            return possible_times;
        }
    
        possible_times = invert(booked_times, request.getDuration());

        return possible_times;
    }
}
