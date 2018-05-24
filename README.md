# HW Manager(API)
![Express(node)+mongodb](https://img.shields.io/badge/Server--end-Express(node)%2Bmongodb-6699ff.svg)  
:books: < **hello!**  
*manage and share homeworks info to classmate.*  
> private work, not generally specification

## Server Environment
Express(node)+mongodb  

## API Specification
[HW Manager API](https://mochiya98.github.io/hw_manager_api/)

## Run Server (native)
> mongodb installation required  

using local data, dont'worry about overwriting.  
```sh
git clone git@github.com:mochiya98/hw_manager_api.git
cd hw_manager_api
npm i
npm start
```

## Run Server (docker)
> ~~maybe doesn't work now.~~  
> ~~because an error occur on git module.~~  
> ~~(published module has a bug... i'm waiting to merge pull request.)~~  
> update: i replaced the module to my forked module to resolve this.  

```sh
git clone git@github.com:mochiya98/hw_manager_api.git
cd hw_manager_api
sudo docker-compose up
```
