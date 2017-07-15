const userModel=require('../../db/model');
const moment = require('moment');
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');

//
exports.getPosts = async (ctx, next) => {
  let res;
  if (ctx.request.querystring) {
    console.log('ctx.request.querystring',decodeURIComponent(ctx.request.querystring.split('=')[1]))
    await userModel.findDataByUser(decodeURIComponent(ctx.request.querystring.split('=')[1]))
      .then(result=>{
        res=JSON.parse(JSON.stringify(result))
        console.log(res)
      })
    await ctx.render('posts',{
        session:ctx.session,
        posts:res 
      })
  }else{
    await userModel.findAllPost()
      .then(result=>{
        console.log(result)
        res=JSON.parse(JSON.stringify(result)) 
        console.log('post',res)
      })
    // console.log("'res['id']'",res[0]['id'])
    // await userModel.findCommentLength(res[1]['id'])
    //  .then(result=>{
    //    console.log('评论数',result)
    //  })
    await ctx.render('posts',{
      session:ctx.session,
      posts:res 
    })
  }
}

//
exports.getPostId = async (ctx, next) => {
  console.log(ctx.params.postId)
  let res,res_pv,comment_res;
  await userModel.findDataById(ctx.params.postId)
    .then(result=>{
      res=JSON.parse(JSON.stringify(result))
      // res_pv=parseInt(result[0]['pv'])
      // res_pv+=1
      console.log(res)
    })
  await userModel.updatePostPv([res_pv,ctx.params.postId])
  await userModel.findCommentById(ctx.params.postId)
    .then(result=>{
      comment_res=JSON.parse(JSON.stringify(result))
      console.log('comment',comment_res)
    })
  await ctx.render('sPost',{
    session:ctx.session,
    posts:res,
    comments:comment_res
  })
}

//
exports.getCreate = async (ctx, next) => {
  await ctx.render('create',{
    session:ctx.session,
  })
}

//
exports.postCreate = async (ctx, next) => {
  let title=ctx.request.body.title
  let content=ctx.request.body.content
  let id=ctx.session.id
  let name=ctx.session.user
  let time=moment().format('YYYY-MM-DD HH:mm')
  console.log([name,title,content,id,time])
  await userModel.insertPost([name,title,content,id,time])
    .then(()=>{
      ctx.body='true'
    }).catch(()=>{
      ctx.body='false'
    })
}

//
exports.postPostId = async (ctx, next) => {
  let name=ctx.session.user
  let content=ctx.request.body.content
  let postId=ctx.params.postId
  
  await userModel.insertComment([name,content,postId])
  await userModel.findDataById(postId)
      .then(result=>{
        res_comments=parseInt(JSON.parse(JSON.stringify(result))[0]['comments'])
        res_comments+=1

      })
  await userModel.updatePostComment([res_comments,postId])
    .then(()=>{
      ctx.body='true'
    }).catch(()=>{
      ctx.body='false'
    })
}

//
exports.getPostIdEdit = async (ctx, next) => {
  let name=ctx.session.user
  let postId=ctx.params.postId
  
  await userModel.findDataById(postId)
    .then(result=>{
      res=JSON.parse(JSON.stringify(result))
      console.log('修改文章',res)
    })
  await  ctx.render('edit',{
      session:ctx.session,
      posts:res
    })
}

//
exports.postPostIdEdit = async (ctx, next) => {
  let title=ctx.request.body.title
  let content=ctx.request.body.content
  let id=ctx.session.id
  let postId=ctx.params.postId
    
  await userModel.updatePost([title,content,postId])
    .then(()=>{
      ctx.body='true'
    }).catch(()=>{
      ctx.body='false'
    })
}

//
exports.getPostIdRemove = async (ctx, next) => {
  let postId=ctx.params.postId
  await userModel.deleteAllPostComment(postId)
  await userModel.deletePost(postId)
    .then(()=>{
       ctx.body={
        data:1
       }
    }).catch(()=>{
      ctx.body={
        data:2
       }
    })
}

//
exports.postPostIdCommentIdRemove = async (ctx, next) => {
  let postId=ctx.params.postId
  let commentId=ctx.params.commentId
  await userModel.findDataById(postId)
      .then(result=>{
        res_comments=parseInt(JSON.parse(JSON.stringify(result))[0]['comments'])
        console.log('res',res_comments)
        res_comments-=1
        console.log(res_comments)
      })
  await userModel.updatePostComment([res_comments,postId])
  await userModel.deleteComment(commentId)
    .then(()=>{
       ctx.body={
        data:1
       }
    }).catch(()=>{
        ctx.body={
        data:2
       }

    })
}
