import { useState, useEffect } from "react";
import { fetchArticles } from "../api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import Logout from "./Logout";

const Articles = ({user, setUser, error, setError}) => {
    const [articles, setArticles] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({})
    
    const navigate = useNavigate()
    
      useEffect(() => {
      setIsLoading(true);
      fetchArticles().then((response) => { 
        setArticles(response);
         setIsLoading(false);
      })
      .catch(({response}) => {
        setError({ response })
      })
    }, []);

   

    const handleChange = (event) => {
      setForm((currentForm) => {
          const information = { ...currentForm, [event.target.id]: event.target.value }
          return information
      })
    }

    const handleSubmit = (event) => {
      event.preventDefault()
      setIsLoading(true);
      fetchArticles(form.sort_by, form.order).then((response) => { 
        setArticles(response);
         setIsLoading(false);
      })
      .catch(({response}) => {
        setError({ response })
      })
    }
    

    if (error)  {
      return <ErrorPage error={error}/>
    }

    else if (user === null) {
      return  navigate("/");
    }

    else if (isLoading) return <h2 className= "loading">Loading...</h2>
    else
    return (
      <div className="singleArticlePage">
      <img className ="posavatar" src={user.avatar} alt= {user.username + "'s avatar"} />
     <h3 className="loggedIn">Logged in as {user.username}</h3>
     <Logout/>
        <h2 className = "articlesTitle">All Articles</h2>
  
        <div className="filterArticles">
            <form action="">
         <label htmlFor="sort_by" className="sortBy">Sort By:</label>
         <select id="sort_by" className="filterSortButton" onChange={handleChange}  >
          <option disabled defaultValue="created_at">Select a filter</option>
           <option  value="created_at">Date</option>
           <option  value="article_id">Article ID</option>
           <option  value="votes">Votes</option>
           <option  value="comment_count">Comment Count</option>
         </select>

         <label htmlFor="order"  className="orderBy">Order: </label>
         <select id="order" className="filterOrderButton"  onChange={handleChange}>
           <option disabled defaultValue="DESC">Select Order</option>
           <option value="DESC">Descending</option>
           <option value="ASC">Ascending</option>
         </select>
         </form>
         <button className="filterArticlesButton" onClick= {handleSubmit} value="Submit">Submit</button>
        </div> 
        <div className="background">
        <ul className="listItems">
          {articles.map((article) => {
            return (
              <li className="eachArticle" key = {article.article_id}>
                <Link to={`/articles/${article.article_id}`}>
                <h2 className="date">  {article.created_at.substring(10,8)}-{article.created_at.substring(7,5)}-{article.created_at.substring(4,0)}</h2>
                <h3 className="articleInfo">{article.title}</h3>
                <h4>By {article.author}</h4>
                <p className="articleOverviewID">Article ID - {article.article_id}  </p>
                <p className="articleOverviewVotes">Votes:  {article.votes}  </p> 
                <p className="articleOverviewComments">Comments - {article.comment_count}</p>
                <p className="openArticle" > Read More </p>
                </Link>
              </li>
            );
           })
          }
        </ul>
        </div>
      </div>
    )
}

export default Articles