var access_token, token_expire_time

const user_id = '294610886'
const client_id = 'jIC1ZsbUkDO_E2FymKEd'
const client_secret = 'NceYZWK68aCYctPihLoBnq_7iXOQ0Jfq4nVgx5hq'

// Получение access_token
async function getAccessToken(url) {
    // const url = 'https://api.avito.ru/token'
    const data = "client_id=jIC1ZsbUkDO_E2FymKEd&client_secret=NceYZWK68aCYctPihLoBnq_7iXOQ0Jfq4nVgx5hq&grant_type=client_credentials";
    const headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    await fetch(url, {
      method: 'POST',
      headers: headers,
      body: data,
    })
    .then(response => response.json())
    .then(data => authToken(data));

    function authToken(data){
      try{
        access_token = data.access_token
        token_expire_time = data.expires_in
        return console.log('Авторизация прошла успешно\n\n' + access_token + '\n')
      }catch (error){
          return console.error('Ошибка при авторизации:', error)
      }
    }
    getReviews('https://api.avito.ru/ratings/v1/reviews', access_token);
}

async function getReviews(url, access_token) {
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
    .then(data => authToken(data));
    function authToken(data){
      try{
        let reviewScore = data.reviews[0].score
        let reviewStage = data.reviews[0].stage
        let reviewText = data.reviews[0].text
        let usedInScore = data.reviews[0].usedInScore
        let senderName = data.reviews[0].sender.name
        let placingTitle = data.reviews[0].item.title
        let reviewAnswerText = data.reviews[0].answer.text
        return console.log(data.reviews[1].answer)
      }catch (error){
          return console.error('Ошибка при получении отзывов:', error)
      }
    }
}

getAccessToken('https://api.avito.ru/token');
