SELECT
    count(round(s1.departure_delay / 60)),
    round(s1.departure_delay / 60) as delay_minutes

FROM
    public.stops s1

WHERE s1.station_id = 455
  AND s1.departure_delay NOTNULL

GROUP BY round(s1.departure_delay / 60);
