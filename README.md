# hexyback-workshop

## Setting api key

Set the api key

```sh
pnpm sst secrets set API_KEY $(cat /dev/urandom | head | sha1sum | cut -f1 -d' ')
```
