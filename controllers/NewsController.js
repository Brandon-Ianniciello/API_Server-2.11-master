const NewsRepository = require('../models/newsRepository');
module.exports=
class NewsController extends require("./Controller") {
    constructor(req,res,params){
        super(req,res,params,false);
        this.newsRepository = new NewsRepository(req);
    }

    head(){
        this.response.JSON(null, this.newsRepository.ETag);
    }
    get(id){
        if(this.params === null){
            if(!isNaN(id)) {
                this.response.JSON(this.newsRepository.get(id));
            }
            else
                this.response.JSON(this.newsRepository.getAll(),
                                    this.newsRepository.ETag);
        }
        else{
            if(Object.keys(this.params).length === 0) {
                this.queryStringHelp()
            }else{
                this.response.JSON(this.newsRepository.getAll(this.params), this.newsRepository.ETag);
            }
        }
    }
    post(news){
        if(this.requestActionAuthorized()){
            let newNews = this.newsRepository.add(news);
            if(newNews)
                this.response.created(newNews);
            else
                this.response.unprocessable();
        } else  
            this.response.unAuthorized();
    }
    put(news){
        if(this.requestActionAuthorized()) {
            if(this.newsRepository.update(news))
                this.response.ok();
            else
                this.response.unAuthorized();
        } else
            this.response.unAuthorized();
    }
    remove(id){
        if(this.requestActionAuthorized()) {
            if(this.newsRepository.remove(id))
                this.response.accepted();
            else
                this.response.notFound();
        }else
            this.response.unAuthorized();
    }
}