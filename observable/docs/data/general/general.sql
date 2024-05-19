SELECT
    avg(s1.departure_delay) as avg_departure_delay_s,
    sum(s1.departure_delay) as sum_departure_delay_s,
    avg(s1.arrival_delay) as avg_arrival_delay_s,
    sum(s1.arrival_delay) as sum_arrival_delay_s,
    count(s1.arrival_delay) as arrival_count,
    count(s1.departure_delay) as departure_count,
    avg(s1.arrival_delay - s1.departure_delay) as avg_time_saving_s,
    sum(s1.arrival_delay - s1.departure_delay) as sum_time_saving_s

FROM
    public.stops s1
