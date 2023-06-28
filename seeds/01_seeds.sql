INSERT INTO users(
  name,
  email,
  password
)
VALUES ('kevin', 'kevin@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('alec', 'alec@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('qing', 'qing@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties(
  owner_id,
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  country,
  street,
  city,
  province,
  post_code,
  active
)
VALUES (1, 'car', 'message', 'https://www.google.com/search?sxsrf=APwXEdcicScggizRWTq86KO1KIEBmYJa2A:1687991298689&q=car&tbm=isch&sa=X&ved=2ahUKEwi80_fNgef_AhV9jokEHdelDZQQ0pQJegQIDhAB&biw=1920&bih=969&dpr=1#imgrc=aMDzA1CzYiuoWM', 'www.1.com', 'Canada', '156 queen St', 'Toronto', 'Ontario', 'XXX_XXX', TRUE),
(2, 'car', 'message', 'https://www.google.com/search?sxsrf=APwXEdcicScggizRWTq86KO1KIEBmYJa2A:1687991298689&q=car&tbm=isch&sa=X&ved=2ahUKEwi80_fNgef_AhV9jokEHdelDZQQ0pQJegQIDhAB&biw=1920&bih=969&dpr=1#imgrc=aMDzA1CzYiuoWM', 'www.2.com', 'Canada', '157 queen St', 'Toronto', 'Ontario', 'XXX_XXX', TRUE),
(3, 'car', 'message', 'https://www.google.com/search?sxsrf=APwXEdcicScggizRWTq86KO1KIEBmYJa2A:1687991298689&q=car&tbm=isch&sa=X&ved=2ahUKEwi80_fNgef_AhV9jokEHdelDZQQ0pQJegQIDhAB&biw=1920&bih=969&dpr=1#imgrc=aMDzA1CzYiuoWM', 'www.2.com', 'Canada', '158 queen St', 'Toronto', 'Ontario', 'XXX_XXX', TRUE);

INSERT INTO reservations(
  start_date,
  end_date,
  property_id,
  guest_id
)
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);

INSERT INTO property_reviews (
  guest_id,
  property_id,
  reservation_id,
  message
)
VALUES (1, 1, 1, 'message'),
(2, 2, 2, 'message'),
(3, 3, 3, 'message');