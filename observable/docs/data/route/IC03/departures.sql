select t.id, min(s.departure) as departure from trains t inner join public.stops s on t.id = s.train_id inner join public.stations s2 on s2.id = s.station_id
where t.route_id = 'IC 03'
group by t.id
order by departure;
