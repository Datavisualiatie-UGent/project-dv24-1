SELECT
    round(avg(s1.departure_delay)) as delay,
    extract(day from s1.departure) as day,
    extract(month from s1.departure) as month

FROM
    public.stops s1

WHERE s1.station_id = 455
  AND s1.departure_delay NOTNULL

GROUP BY day, month;
