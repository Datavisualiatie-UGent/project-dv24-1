SELECT
    round(avg(s1.departure_delay)) as departure_delay,
    round(avg(s1.arrival_delay)) as arrival_delay,
    CASE WHEN s1.arrival_delay IS NOT NULL
        THEN date(s1.arrival)
        ELSE date(s1.departure)
    END AS date,
    s1.station_id as station

FROM
    public.stops s1

GROUP BY date, station;
