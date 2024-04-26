SELECT
    round(avg(s1.arrival_delay)) as delay_s,
    (extract(dow from s1.arrival) + 6) % 7 as dow,
    extract(hour from s1.arrival) as hour

FROM
    public.stops s1

WHERE s1.station_id = 455
  AND s1.arrival_delay NOTNULL

GROUP BY dow, hour;
