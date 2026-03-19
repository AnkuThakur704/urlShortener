import './App.css'
import { useState } from 'react'
function App() {
  const [url, seturl] = useState()
  const [shorturl, setshorturl] = useState()
  const [invalid, setinvalid] = useState(false)
  const convert = async(e)=>{
    console.log("called")
    e.preventDefault()
    const req = await fetch("http://localhost:8080/convert",{method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        url: url
      })
    })
    console.log("start")
    const data = await req.json()
    console.log("Data: ",data)
    setinvalid(false)
    if(data.success){
      console.log("Data: ",data)
      setshorturl(data.resurl)
    }
    else if(data.invalid){
      setinvalid(true)
    }
    console.log("end")
  }
  return (
    <>  
      <main className='main'>
        <div>
          URL Shortener
        </div>
        <form onSubmit={convert}>
          <input type="text" placeholder='Enter URL' onChange={(e)=> seturl(e.target.value)}/>
          <input type="submit" value={"Convert"}/>
        </form>
        {shorturl&&<div>
        <a href={shorturl}>{shorturl}</a>
        </div>}
        {invalid&&<p>URL is invalid</p>}
      </main>
    </>
  )
}

export default App
