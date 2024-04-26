SELECT
    round(avg(s1.departure_delay)) as delay_s,
    (extract(dow from s1.departure) + 6) % 7 as dow,
    extract(hour from s1.departure) as hour

FROM
    public.stops s1

WHERE s1.station_id = 455
  AND s1.departure_delay NOTNULL

GROUP BY dow, hour;
