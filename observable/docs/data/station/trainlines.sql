SELECT
    round(avg(s1.departure_delay)) as delay_s,
    t.route_id

FROM
    public.stops s1

        LEFT JOIN public.trains t on t.id = s1.train_id

WHERE s1.station_id = 455
  AND s1.departure_delay NOTNULL

GROUP BY t.route_id

HAVING
    count(*) > 1000

ORDER BY delay_s DESC

