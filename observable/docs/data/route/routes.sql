select start_data.id as route, start_id, start_station, end_id, end_station from
(select r.id, r.start_id, s.commercial_name as start_station from routes r inner join public.stations s on s.id = r.start_id)
    as start_data inner join
(select r.id, r.end_id, s.commercial_name as end_station from routes r inner join public.stations s on s.id = r.end_id)
    as stop_data on start_data.id = stop_data.id;


-- ;
