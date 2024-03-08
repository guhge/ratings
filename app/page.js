import { resolve } from "styled-jsx/css";

let token_expire_time, senderName

const user_id = '294610886'
const client_id = 'jIC1ZsbUkDO_E2FymKEd'

// Получение access_token
async function getAccessToken(url) {
    // const url = 'https://api.avito.ru/token'
    let access_token;
    const client_secret = 'NceYZWK68aCYctPihLoBnq_7iXOQ0Jfq4nVgx5hq'
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("client_id", "jIC1ZsbUkDO_E2FymKEd");
    urlencoded.append("client_secret", "NceYZWK68aCYctPihLoBnq_7iXOQ0Jfq4nVgx5hq");
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
      cache: "no-cache" 
    };

    // fetch("https://api.avito.ru/token", requestOptions)
    return new Promise((resolve, reject) => {
      if (true) {
        return resolve(fetch("https://api.avito.ru/token", requestOptions));
      }
    });
}

async function getReviews(url, access_token) {
    let reviews;
    const headers = {
        'Authorization': 'Bearer ' + access_token,
        "Content-Type": "application/json"
      };
    url = new URL(url)
    url.searchParams.append('offset', 0);
    url.searchParams.append('limit', 10);
    await fetch(url, {
      method: 'GET',
      headers: headers
    })
    .then(response => response.json())
    .then(data => {
      reviews = data
    });
    return reviews;
    // function authToken(data){
    //   return data;
    //   try{
    //     let reviewScore = data.reviews[0].score
    //     let reviewStage = data.reviews[0].stage
    //     let reviewText = data.reviews[0].text
    //     let usedInScore = data.reviews[0].usedInScore
    //     senderName = data.reviews[0].sender.name
    //     let placingTitle = data.reviews[0].item.title
    //     try{
    //       let reviewAnswerText = data.reviews[0].answer.text
    //     }catch (error){
    //       console.error('Ошибка при получении отзывов:', error)
    //     }
    //     return console.log(data.reviews[1].answer)
    //   }catch (error){
    //       return console.error('Ошибка при получении отзывов:', error)
    //   }
    // }
}

// getAccessToken('https://api.avito.ru/token');

async function Home() {
  let access_token = await getAccessToken('https://api.avito.ru/token')
  .then((response) => response.json())
  .then((result) => {
    // console.log(result.access_token);
    return result.access_token
  });
  
  let reviews = await getReviews('https://api.avito.ru/ratings/v1/reviews', access_token);
  console.log(reviews);
  let date, rating, staged, usedInScore, reviewAnswerText;
  for (let i = 0; i < 10; i++){
    try {
      console.log(i);
      usedInScore = reviews.reviews[i].usedInScore;
      date = new Date(reviews.reviews[i].createdAt * 1000);
      let stage = reviews.reviews[i].stage;
      switch (stage){
        case 'done':
          staged = 'Сделка состоялась';
          break;
        case 'fell_through':
          staged = 'Сделка сорвалaсь';
          break;
        case 'not_agree':
          staged = 'Не договорились';
          break;
        case 'not_communicate':
          staged = 'Не общались';
          break;
      }
      if (usedInScore == true){
        switch (reviews.reviews[i].score){
          case 5:
            rating = '★★★★★';
            break;
          case 4:
            rating = '★★★★☆';
            break;
          case 3:
            rating = '★★★☆☆';
            break;
          case 2:
            rating = '★★☆☆☆';
            break;
          case 1:
            rating = '★☆☆☆☆';
            break;
          default:
            rating = '';
            break;
        }
      }else if (usedInScore == false){
        rating = '';
      }
    }catch(error){
      break;
    }
    
  }
  // let codeBlock = '<b>Ответ</b><br/>' + reviews.reviews[1].answer.text;
  // document.getElementById("reply").innerHTML = codeBlock

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="review">
      <br/><span id="name">{reviews.reviews[1].sender.name}</span>
      <br/><span className="date">{date.toLocaleDateString("ru-GB")}</span>
      <br/><span className="status"><span className="text-yellow-400">{rating}</span> {staged}: "{reviews.reviews[1].item.title}"</span>
      <br/><b>Комментарий</b><br/>{reviews.reviews[1].text}
      <br/><span className="reply"></span>
      </div>
    </main>
  );
}
export default Home;