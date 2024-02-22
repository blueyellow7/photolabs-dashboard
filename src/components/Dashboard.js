import React, { Component } from "react";
import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";
import {
    getTotalPhotos,
    getTotalTopics,
    getUserWithMostUploads,
    getUserWithLeastUploads
      // these are helper functions used to get stats about the photos/topics data loaded by the api fetch request (see below)
  } from "helpers/selectors"; 


const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos 
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads
  }

];

class Dashboard extends Component {
  /* 1) METHOD 1 - WAY TO BIND 'THIS'. Bind in the constructor adding these lines:
    constructor(props) {
      super(props);
      this.selectPanel = this.selectPanel.bind(this); //eg. binding "this" to selectPanel function
    } */
  
  state = {
    loading: true,
    focused: null,
    photos: [],
    topics: []
  };


  // COMPONENTDIDMOUNT and COMPONENTDIDUPDATE can be used to store state in local storage

  componentDidMount() {
    // componentDidMount checks if there's already a saved state. When we render the first time, it saves the state.
    const focused = JSON.parse(localStorage.getItem("focused"));
    if (focused) {
      this.setState({ focused });
    }

    // In React, both componentDidMount and useEffect can be used for performing side effects such as data fetching. However, componentDidMount is a lifecycle method in CLASS components that's called after the component has been mounted (i.e., inserted into the DOM tree). It's not directly tied to functional components.
    const urlsPromise = [
      "/api/photos",
      "/api/topics",
        // because we are fetching 2 urls: by placing both urls in an array, we can fetch both, parse both (.json), and return each response as an element in the array.
    ].map(url => fetch(url).then(response => response.json()));
    
    Promise.all(urlsPromise)
    .then(([photos, topics]) => { 
      // naming the response data as [photos, topics] = array destructuring. photos are 1st in the array, topics are second, as according to the order we fetched them.
      this.setState({
        loading: false,
        photos: photos,
        topics: topics
      });
    });
  }
  componentDidUpdate(previousProps, previousState) {
    //componentDidUpdate compares previousState to current state. if state has changed, we update that value to localStorage.
    // notice: JSON.stringify used to convert our state before writing it into localStorage. JSON.parse used to convert state BACK to Javascript when taking it out of storage.
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }


  // selectPanel function goal: change state of focused. id will depend on which panel was clicked -> pass this function to onClick handler in "Panel" component
  selectPanel(id) {
    /* 1) METHOD 2 - Using Arrow function like so: 
    selectPanel = (id) => { ... */ 
    this.setState(previousState => ({ focused: previousState.focused !== null ? null : id }));
  }


  render() {
    const dashboardClasses = classnames(
      "dashboard", 
      { "dashboard--focused": this.state.focused }
    );
      //"dashboard--focused" = conditional CSS class that changes depending on if focused = null or not

    if (this.state.loading) {
    console.log("while loading: ", this.state)
      return <Loading />;
    }
    console.log("after loading: ", this.state)

    // When focused = null, we are in a four-panel view. focused can also equal 1 of 4 of the panel ids. 
    // eg. when focused = 4, we render only panel id 4 using filtering:
    const panels = (this.state.focused ? data.filter(panel => this.state.focused === panel.id) : data)
      .map( (panel, index) => {
        return  <Panel
                  key={index}
                  id={panel.id}
                  label={panel.label}
                  value={panel.getValue(this.state)}
                  onSelect={(event) => this.selectPanel(panel.id)}
                    /* 1) METHOD 3 - Using Arrow function in render, as seen in line right above */
                />
      });

    return (
    <main className={dashboardClasses}>
      {panels}
    </main>
    );
  }
}

export default Dashboard;
