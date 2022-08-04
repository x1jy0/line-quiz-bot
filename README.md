# line-quiz-bot

## local での起動の仕方

Docker を起動する

```
docker-compose up
```

コンテナに入る

```
docker-compose exec node bash
```

Angular を起動する

```
cd app
ng serve --host 0.0.0.0 --disable-host-check
```

ngrok を起動する

```
ngrok start liff strapi --region jp
```
