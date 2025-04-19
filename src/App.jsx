import moment from "moment";
import React from "react"

const DayName = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat"
};

function Cell({ value }) {
  function cellcolor(value) {
    if (value > 8) return "bg-purple-800";
    if (value > 6) return "bg-purple-600";
    if (value > 4) return "bg-purple-400";
    if (value > 2) return "bg-purple-200";
    else return "bg-purple-100";
  }

  return (
    <div className={`w-3 h-3 m-[2px] rounded-sm ${cellcolor(value)}`}></div>
  );
}

function WeekDay({ index }) {
  return (
    <div className="w-8 h-3 m-[2px] text-center text-xs flex items-center justify-center">
      {DayName[index]}
    </div>
  );
}

function Timeline({ range, data }) {
  const days = Math.abs(range[0].diff(range[1], 'days'));
  const startDate = range[0];
  const DayFormat = 'DDMMMYYYY';

  // Group days into weeks (columns)
  const weeks = [];
  let currentWeek = Array(7).fill(null); // Array for 7 days, Sunday to Saturday
  for (let i = 0; i < days; i++) {
    const date = moment(startDate).add(i, 'day');
    const dayOfWeek = date.day(); // 0 = Sunday, 6 = Saturday
    const value = data.find(d => moment(date).format(DayFormat) === moment(d.date).format(DayFormat))?.value || 0;
    currentWeek[dayOfWeek] = { date, value };

    if (dayOfWeek === 6 || i === days - 1) { // End week on Saturday or last day
      weeks.push([...currentWeek]);
      currentWeek = Array(7).fill(null);
    }
  }

  // Determine month labels for each week
  const monthLabels = weeks.map((week, index) => {
    const firstDay = week.find(day => day !== null);
    return firstDay ? firstDay.date.format('MMM') : null;
  });
  let lastMonth = null;
  const displayMonths = monthLabels.map(month => {
    if (month && month !== lastMonth) {
      lastMonth = month;
      return month;
    }
    return null;
  });

  return (
    <div className="p-4 flex flex-row">
      {/* Weekdays stacked vertically on the left */}
      <div className="flex flex-col pt-4.5">
        {Array.from({ length: 7 }).map((_, dayIndex) => (
          <WeekDay key={dayIndex} index={dayIndex} />
        ))}
      </div>

      {/* Months and Grid */}
      <div className="flex flex-col">
        {/* Month labels */}
        <div className="flex flex-row">
          {displayMonths.map((month, index) => (
            <div key={index} className="w-3 m-[2px] text-center text-xs">
              {month || ''}
            </div>
          ))}
        </div>

        {/* Grid: rows are days of week, columns are weeks */}
        <div className="flex flex-col">
          {Array.from({ length: 7 }).map((_, dayIndex) => (
            <div key={dayIndex} className="flex flex-row">
              {weeks.map((week, weekIndex) => {
                const day = week[dayIndex];
                return day ? (
                  <Cell key={weekIndex} value={day.value} />
                ) : (
                  <div key={weekIndex} className="w-3 h-3 m-[2px]"></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const startDate = moment().add(-365, "days");
  const dateRange = [startDate, moment()];
  const data = Array.from(new Array(365)).map((_, index) => ({
    date: moment(startDate).add(index, "day"),
    value: Math.floor(Math.random() * 10) // Random values for testing
  }));

  return (
    <div className="container mx-auto">
      <Timeline range={dateRange} data={data} />
    </div>
  );
}