const initialState={
   list: [
       {
           key: '',
           city:'Penedo',
           state: 'AL',
           country: 'Brazil'
       }
   ]
}

export default (state = initialState, action:any) => {
   let newList = [...state.list];

    switch(action.type) {
        case 'ADD_NOTE':
            newList.unshift({
                key:action.payload.key,
                city: action.payload.city,
                state: action.payload.state,
                country:action.payload.country
            })
            if (newList.length > 3) {
               newList.pop();
              }
            break;

    }
    
    return {...state, list:newList};
}