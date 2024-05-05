SELECT
    round(avg(s1.departure_delay)) as departure_delay,
    round(avg(s1.arrival_delay)) as arrival_delay,
    t.route_id as route,
    s1.station_id as station

FROM
    public.stops s1

LEFT JOIN public.trains t on t.id = s1.train_id

GROUP BY t.route_id, station

HAVING
    count(*) > 1000
