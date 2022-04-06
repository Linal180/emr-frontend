import { core, usAutocompletePro, usZipcode, usStreet } from 'smartystreets-javascript-sdk'


const smartyId = process.env.SMARTY_ID || 'c9ba762d-47d1-a874-c0f9-13c80894d76d';
const smartyToken = process.env.SMARTY_TOKEN || 'rKqWvqJFyiFJdgwd4XgC';



interface GetAddressResponse {
  zipCode: usZipcode.ZipCode;
  status: boolean;
  message: string;
}

interface VerifyResponse {
  status: boolean;
  message: string;
  options: usStreet.Candidate[]
}

interface AutoCompleteResponse {
  status: boolean;
  message: string;
  options: any
}
/**
 * Smarty address
 */

/**
 * Gets address by zipcode
 * @param zipCode 
 */
export const getAddressByZipcode = async (zipCode: string): Promise<GetAddressResponse> => {
  const staticCredentials = new core.StaticCredentials(smartyId, smartyToken);
  const clientBuilder = new core.ClientBuilder(staticCredentials);

  const client = clientBuilder.buildUsZipcodeClient();
  const lookup = new usZipcode.Lookup();
  lookup.zipCode = zipCode;
  let response: GetAddressResponse = {
    message: '',
    status: false,
    zipCode: {
      zipcode: "",
      alternateCounties: [],
      countyFips: '',
      countyName: "",
      defaultCity: '',
      latitude: 0,
      longitude: 0,
      precision: '',
      state: '',
      stateAbbreviation: '',
      zipcodeType: ''
    }
  }

  try {
    const result = await client.send(lookup);
    result?.lookups?.map((lookup) => lookup?.result?.map((candidate) => {
      const address = candidate?.zipcodes?.find((zipcode) => zipcode.zipcode === zipCode);
      if (address?.state) {
        response.message = 'Address';
        response.status = true;
        response.zipCode = address
      }
      else {
        response.message = 'Invalid ZIP Code';
        response.status = false;
      }
      return address;
    }));

    return response
  }
  catch (err) {
    console.log(err);
  }
  response.message = 'Address not found';
  response.status = false;
  return response;
}

/**
 * Verifys address
 */
export const verifyAddress = async (zipCode: string, city: string, state: string, address: string, address2: string): Promise<VerifyResponse> => {
  const staticCredentials = new core.StaticCredentials(smartyId, smartyToken);
  const clientBuilder = new core.ClientBuilder(staticCredentials);
  const client = clientBuilder.buildUsStreetApiClient();
  const lookup = new usStreet.Lookup();
  lookup.zipCode = zipCode;
  lookup.city = city;
  lookup.state = state;
  lookup.street = address;
  lookup.street2 = address2
  lookup.match = 'enhance'

  let response: VerifyResponse = {
    status: false,
    message: 'Invalid',
    options: []
  }


  try {
    const result = await client.send(lookup);
    const { lookups } = result || {};

    lookups?.map((look, index) => {
      if (look?.result?.length > 0) {
        response.message = 'Address found'
        response.status = true;
        response.options = look.result
      }
      else {
        response.message = 'Address not found'
        response.status = false;
        response.options = []
      }
      return look.result
    });
    return response
  }
  catch (err) {
    console.log(err);
    return response
  }
}

export const addressAutoComplete = async (search: string, selected: string): Promise<AutoCompleteResponse> => {
  const staticCredentials = new core.StaticCredentials(smartyId, smartyToken);
  const clientBuilder = new core.ClientBuilder(staticCredentials);
  const client = clientBuilder.buildUsAutocompleteProClient();
  const lookup = new usAutocompletePro.Lookup(search);
  lookup.maxResults = 10;
  lookup.selected = selected;

  try {
    const result = await client.send(lookup);
    console.log('result => ', result?.result);
    const data = {
      status: true,
      message: "Address found",
      options: result?.result ?? []
    }
    return data
  } catch (err) {
    console.log('error => ', err);
    const data = {
      status: false,
      message: 'Not found',
      options: []
    }
    return data
  }
}


