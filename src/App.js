import './App.css';
import {useEffect, useState} from 'react'
import axios from 'axios'

function App() {
  const CLIENT_ID = 'f5fcf014164242198559887c0cee6763'
  const REDIRECT_URI = 'http://localhost:3000'
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPOSNE_TYPE = 'token'

  const [token, setToken] = useState('')
  const [search, setSearch] = useState('')
  const [artists, setArtists] = useState([])
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [albumLoading, setAlbumLoading] = useState(true)

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem('token')

    if(!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1]

      window.location.hash = ''
      window.localStorage.setItem('token', token)
    }
    
    setToken(token)

  }, [])

  const logout = () => {
    setArtists('')
    setAlbums('')
    setToken('')
    setLoading(true)
    setAlbumLoading(true)
    window.localStorage.removeItem('token')
  }

  const searchArtists = async (e) => {
    e.preventDefault();
    const {data} = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: search,
        type: 'artist'
      }
    }) 
    setArtists(data.artists.items[0])
    setLoading(false)
  }
  
  const searchAlbums = async (e) => {
    e.preventDefault();
    const {data} = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: search,
        type: 'album'
      }
    }) 
    setAlbums(data.albums.items[0])
    setAlbumLoading(false)
  }

  console.log(albums)
  console.log(artists)

  const renderArtists = () => {
    return (
      <div>
        <div>
          <h2>{artists.name}</h2>
        </div><hr/>
        <div>
        {artists.images ? <img width={'600px'} src={artists.images[0].url} alt=''/> : <div><h3>No image</h3></div>}
        </div><hr/>
        <h3>Genres</h3>
        <p>
        {artists.genres}
        </p>
        <hr/>
        <h3>Popularity (1-100)</h3>
        {artists.popularity}
        <hr/>
        <h3>Followers</h3>
        {artists?.followers?.total}
        <hr/>
      </div>
      )
  }

  const renderAlbums = () => {
    return(
      <div>
        <div>
          <h2>{albums.name}</h2><div/>
          {albums.images ? <img width={'600px'} src={albums.images[0].url} alt=''/> : <div><h3>No image</h3></div>}
        </div>
        <div>
          <h2>Created By</h2>
          <h3>{albums.artists[0].name}</h3><hr/>
          <h2>Released (YEAR/MM/DD)</h2>
          <h3>{albums.release_date}</h3><hr/>
          <h2>Total Tracks</h2>
          <h3>{albums.total_tracks}</h3>
        </div>
      </div>
    )
  }

  const clearSelection = () => {
    setArtists('')
    setAlbums('')
    setLoading(true)
    setAlbumLoading(true)
  }


  return (
    <div className="App">
      <header className="App-header">
        <img width={'200px'} src='./spotLogo.png' alt='spotify logo'/>
        <h1>Spotify React Project</h1>
        {!token ? 
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPOSNE_TYPE}`}>Login to Spotify</a>
        : <button onClick={logout} style={{
          height: 50,
          width: 200,
          fontSize: 40,
        }}>Logout</button>}
        <div style={{margin: 8}}/>
        <button onClick={clearSelection}>Clear Search</button>
        {token ? 
          <div>
            <form onSubmit = {searchArtists}>
              <hr/>
              <label>Artist: </label> <div/>
              <input type='text' onChange={e => setSearch(e.target.value)}/><div/>
              <input type='submit'/>
            </form>
            <form onSubmit = {searchAlbums}>
              <hr/>
              <label>Album:</label><div/>
              <input type='text' onChange={e => setSearch(e.target.value)}/><div/>
              <input type='submit'/>
            </form>
        </div>
            : <h3>Please login to access search functionality.</h3>
        }
        {loading ? 
        '' : 
        renderArtists()
      }
        {albumLoading ?
        '' :
        renderAlbums()
      }
      </header>
    </div>
  );
}

export default App;
