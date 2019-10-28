import React, { Component, Fragment } from 'react';
import api from 'utils/api';
import Layout from 'components/Layout';
import Modal from 'components/Modal';
import styles from './style.module.scss';

class Home extends Component{
  state = {
    loading: true,
    rockets: [],
    modal: false,
    modalRocketID: null,
  }

  componentDidMount(){
    this.initialize();
  }

  initialize = async() => {
    const rockets = await api({path:'rockets'});
    console.log({rockets});
    this.setState({
      rockets,
      loading: false,
    });
  }

  toggleModal = ( id = null ) => {
    this.setState({
      ...(id ? {modalRocketID: id} : null),
      modal: !this.state.modal,
    });
  }

  cutDescription = ( description ) => {
    return `${description.replace(/^(.{60}[^\s]*).*/, "$1")}...` ;
  }

  generateModal = () => {
    const { rockets, modalRocketID } = this.state;
    const rocket = rockets.find((rocket) => rocket.id === modalRocketID);

    if(rocket){
      const {flickr_images: images, description, rocket_name: name} = rocket;
      return(
        <Modal onClose={this.toggleModal} images={images}>
          <h2>{name}</h2>
          <p>{description}</p>
        </Modal>
      );
    }
    else
      return null;
  }

  render() {
    const { loading, rockets, modal } = this.state;
    return (
      <Layout loading={loading} className={styles.rokcetList}>
        { !loading &&
          <Fragment>
            <h1>Rockets Page</h1>
            {rockets.map((rocket) => 
              <div key={rocket.id} className={`${styles.rocket} ${rocket.active ? styles.active : styles.inactive}`} onClick={() => this.toggleModal(rocket.id)}>
                {rocket.flickr_images && 
                  <div className={styles.leftSide}>
                    <img src={rocket.flickr_images[0]} className={styles.fullCenter} />
                  </div>
                }
                <div className={styles.rightSide}>
                  <h3>{rocket.rocket_name}</h3>
                  <p>{ this.cutDescription( rocket.description ) }</p>
                </div>
              </div>
            )}
            {modal && this.generateModal()}
          </Fragment>
        }
      </Layout>
    );
  }
}

export default Home;
