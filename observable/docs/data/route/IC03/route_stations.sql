select distinct s2.commercial_name as station, s2.latitude, s2.longitude
from public.trains t
    inner join public.stops s on t.id = s.train_id
    inner join public.stations s2 on s2.id = s.station_id
where t.route_id = 'IC 03';
