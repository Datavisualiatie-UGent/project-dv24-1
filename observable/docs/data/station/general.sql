SELECT
    round(avg(s1.departure_delay)) as avg_delay_s,
    round(sum(s1.departure_delay)) as sum_delay_s,
    round(avg(s1.arrival_delay)) as avg_arrival_s,
    round(sum(s1.arrival_delay)) as sum_arrival_s,
    count(*) as count,
    avg(s1.departure_delay - s1.arrival_delay) as time_saving_s1

FROM
    public.stops s1

WHERE s1.station_id = 455
