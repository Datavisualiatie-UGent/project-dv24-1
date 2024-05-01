select s.train_id, s2.commercial_name as station
from stops s inner join public.stations s2 on s2.id = s.station_id inner join public.trains t on t.id = s.train_id
where t.route_id = 'IC 03' and
    (s.departure between '2023/1/1' and '2023/1/2' or s.arrival between '2023/1/1' and '2023/1/2')
order by s.departure;
