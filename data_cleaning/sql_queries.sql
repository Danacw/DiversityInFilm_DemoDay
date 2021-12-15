select * from female_filter;

select percent_fm from movies;

update female_filter

alter table female_filter drop column percent_fm 

alter table female_filter
add column percent_fm numeric;

update female_filter
set percent_fm = movies.percent_fm
from movies
where female_filter.id = cast(movies.id as int);

alter table movies
add column percent_fm_copy numeric;

update movies
set percent_fm_copy = replace(trim(both '"' from percent_fm), '%', '')::numeric

alter table movies rename column percent_fm_copy to percent_fm

update female_filter
set percent_fm = movies.percent_fm
from movies
where female_filter.id = cast(movies.id as int);

select id, title, percent_fm from female_filter;
