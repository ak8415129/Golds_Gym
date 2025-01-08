export const exerciseOptions={ 
	method: 'GET',
	headers: {
		  'X-RapidAPI-Key': '2a057a5bd8mshdfe2fedeffa0504p199b83jsn3656b138b053',
		//  'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
		'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
	}
};
export const youtubeOptions = {
	method: 'GET',
	headers: {
	  'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com',
	  'X-RapidAPI-Key': '2a057a5bd8mshdfe2fedeffa0504p199b83jsn3656b138b053',
	},
  };

export const fetchData =async (url,options)=>{

    const response= await fetch(url,options);
    const data=await response.json();

    return data;
}