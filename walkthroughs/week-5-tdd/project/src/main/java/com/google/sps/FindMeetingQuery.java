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
import java.util.ArrayList;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    Collection<String> attendes = request.getAttendees();
    long meetingDuration = request.getDuration();

    ArrayList<TimeRange> timeOfEvents = new ArrayList<>();
    for (Event event : events) {
        if (!Collections.disjoint(event.getAttendees(), attendes))
        {
            timeOfEvents.add(event.getWhen());
        }
    }

    Collections.sort(timeOfEvents, TimeRange.ORDER_BY_START);

	// Gets ride of times that are overlapping
	int i = 0;
    while (i < timeOfEvents.size() - 1) {
        int j = i + 1;
        while (j < timeOfEvents.size()) {
            if (timeOfEvents.get(i).contains(timeOfEvents.get(j))) {
                timeOfEvents.remove(j);
                j--;
            } else if (!(timeOfEvents.get(i).overlaps(timeOfEvents.get(j)))) break;
            j++;
        }
        i++;
    }

	// get in between the elements that are longer than teh meeting duration
    int start = TimeRange.START_OF_DAY;
    Collection<TimeRange> result = new ArrayList<>();
    for (i = 0; i < timeOfEvents.size(); i++) {
        int nextStart = timeOfEvents.get(i).start();
        if (nextStart - start >= meetingDuration) {
            result.add(TimeRange.fromStartEnd(start, nextStart, false));
        }
        start = timeOfEvents.get(i).end();
    }

    //case for end of the day
    if (TimeRange.END_OF_DAY - start >= meetingDuration) {
        result.add(TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true));
    }
    return result;
  }
}
