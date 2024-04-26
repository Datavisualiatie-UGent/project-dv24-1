SELECT
    round(avg(s1.arrival_delay)) as delay_s,
    extract(day from s1.arrival) as day,
    extract(month from s1.arrival) as month

FROM
    public.stops s1

WHERE s1.station_id = 455
  AND s1.arrival_delay NOTNULL

GROUP BY day, month;
