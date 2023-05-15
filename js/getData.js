export async function getData (){
   try {
       const response = await fetch('https://63529bfaa9f3f34c3743f4a5.mockapi.io/items')
       const data = await response.json()
       console.log(data)
       return data
   }catch (e){
       console.log(e)
   }
}

