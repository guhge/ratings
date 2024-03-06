let token_expire_time, senderName

const user_id = '294610886'
const client_id = 'jIC1ZsbUkDO_E2FymKEd'

// Получение access_token
async function getAccessToken(url) {
    // const url = 'https://api.avito.ru/token'
    let access_token;
    const data = "client_id=jIC1ZsbUkDO_E2FymKEd&client_secret=NceYZWK68aCYctPihLoBnq_7iXOQ0Jfq4nVgx5hq&grant_type=client_credentials";
    const headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    await fetch(url, {
      method: 'POST',
      headers: headers,
      body: data,
    })
    .then(response => response.json())
    .then(data => {
      access_token = data.access_token;
      token_expire_time = data.expires_in;
      console.log('Авторизация прошла успешно\n\n' + access_token + '\n')
    });
    return access_token;
    // access_token = data.access_token;
    // return access_token;
    // function authToken(data){
    //   try{
    //     access_token = data.access_token
    //     token_expire_time = data.expires_in
    //     console.log('Авторизация прошла успешно\n\n' + access_token + '\n')
    //     return access_token
    //   }catch (error){
    //     return console.error('Ошибка при авторизации:', error)
    //   }
    // }
    // return authToken(data);
}

async function getReviews(url, access_token) {
    let reviews;
    const headers = {
        'Authorization': 'Bearer ' + access_token,
        "Content-Type": "application/json"
      };
    url = new URL(url)
    url.searchParams.append('offset', 0);
    url.searchParams.append('limit', 3);
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

export async function Home() {
  let access_token = await getAccessToken('https://api.avito.ru/token');
  let reviews = await getReviews('https://api.avito.ru/ratings/v1/reviews', access_token);
  let date = new Date(reviews.reviews[0].createdAt * 1000);
  let stage = reviews.reviews[0].stage;
  let staged;
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="review">
      <br/><span id="name">{reviews.reviews[0].sender.name}</span>
      <br/><span className="date">{date.toLocaleDateString("ru-GB")}</span>
      <br/><span className="status"><span className="text">★★★★☆</span> {staged}: "{reviews.reviews[0].item.title}"</span>
      <br/><b>Комментарий</b><br/>{reviews.reviews[0].text}
      </div>
    </main>
  );
}
export default Home;