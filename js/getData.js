//отримую дані з "сервера"))))
export async function getData (){
   try {
       const response = await fetch('./json/data.json')
       return await response.json()
   }catch (e){
       console.error(e)
   }
}

