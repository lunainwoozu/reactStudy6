import { useEffect, useRef, useState } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import { sortPlacesByDistance } from './loc.js'
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';

const storedPlaceIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const storedPlaces = storedPlaceIds.map((id) => 
  AVAILABLE_PLACES.find((place) => place.id === id)
)

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsopen] = useState(false)
  const [availablePlace, setAvailablePlaces] = useState([])
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      )
      
      setAvailablePlaces(sortedPlaces)
    });
  }, []);

  function handleStartRemovePlace(id) {
    setModalIsopen(true)
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsopen(false)
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // 스토리지 저장
    const storedPlaceIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    if (storedPlaceIds.indexOf(id) === -1){
      localStorage.setItem('selectedPlaces',
        JSON.stringify([id, ...storedPlaceIds])
      )      
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );

    setModalIsopen(false)

    // 스토리지에서 삭제
    const storedPlaceIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem(
      'selectedPlaces',
      JSON.stringify(storedPlaceIds.filter((id) => id !== selectedPlace.current))
    );
  }

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlace}
          fallbackText='Sorting places by distance..'
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
