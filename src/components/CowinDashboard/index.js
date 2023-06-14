import Loader from 'react-loader-spinner'

import {Component} from 'react'

import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'

import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiConstants.initial,
    covidDetailsList: {},
  }

  componentDidMount() {
    this.getCovidData()
  }

  getCovidData = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const covidUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(covidUrl)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachVaccin => ({
          vaccineDate: eachVaccin.vaccine_date,
          dose1: eachVaccin.dose_1,
          dose2: eachVaccin.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age.map(vaccinByAge => ({
          age: vaccinByAge.age,
          count: vaccinByAge.count,
        })),
        vaccinationByGender: data.vaccination_by_gender.map(vaccinByGender => ({
          count: vaccinByGender.count,
          gender: vaccinByGender.gender,
        })),
      }

      this.setState({
        covidDetailsList: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderVaccinDetails = () => {
    const {covidDetailsList} = this.state
    return (
      <>
        <VaccinationCoverage
          covidDetailsList={covidDetailsList.last7DaysVaccination}
        />
        <VaccinationByGender
          covidDetailsList={covidDetailsList.vaccinationByAge}
        />
        <VaccinationByAge
          covidDetailsList={covidDetailsList.vaccinationByAge}
        />
      </>
    )
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Something Went Wrong</h1>
    </div>
  )

  renderInProgress = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderCovidDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderVaccinDetails()
      case apiConstants.failure:
        return this.renderFailure()
      case apiConstants.inProgress:
        return this.renderInProgress()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="cowin-dashboard-container">
          <div className="logo-container">
            <img
              className="logo"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <h1 className="logo-heading">Co-WIN</h1>
          </div>
          <h1 className="heading">CoWIN Vaccination in India</h1>
          {this.renderCovidDetails()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
