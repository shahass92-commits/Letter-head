import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Required scopes for Google Forms and Drive
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/forms.body');
provider.addScope('https://www.googleapis.com/auth/forms.responses.readonly');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Load cached token from memory during session if available
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve the Google Access Token.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Core Google sign-in failure:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// -------------------------------------------------------------
// Google Forms API Services
// -------------------------------------------------------------

export interface FormResponseDetail {
  responseId: string;
  submittedAt: string;
  answers: {
    name: string;
    accepted: string;
    date: string;
  };
}

/**
 * Creates an official appointment acceptance Google Form
 */
export const createAcceptanceForm = async (
  accessToken: string,
  candidateName: string,
  designation: string
): Promise<{ formId: string; responderUri: string }> => {
  // 1. Create a blank form with a professional title
  const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title: `Appointment Acceptance - ${candidateName}`,
        documentTitle: `Compass Joining - ${candidateName}`,
        description: `This Google Form records the official acceptance of appointment for the role of ${designation} at Compass Travel & Transportation.`
      }
    })
  });

  if (!createRes.ok) {
    const errorData = await createRes.json();
    throw new Error(errorData.error?.message || 'Failed to create Google Form');
  }

  const formObj = await createRes.json();
  const formId = formObj.formId;
  const responderUri = formObj.responderUri;

  // 2. Add question items using batchUpdate to capture Name, Acceptance option, and Date
  const batchUpdateRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          createItem: {
            item: {
              title: "Full Name",
              description: "Please enter your legal name as specified in the letter.",
              questionItem: {
                question: {
                  required: true,
                  textQuestion: {}
                }
              }
            },
            location: { index: 0 }
          }
        },
        {
          createItem: {
            item: {
              title: "Do you accept this appointment offer?",
              description: "Confirming compliance with the terms and conditions outlined in the appointment letter.",
              questionItem: {
                question: {
                  required: true,
                  choiceQuestion: {
                    type: "RADIO",
                    options: [
                      { value: "Yes, I accept this appointment offer & joining coordinates." },
                      { value: "No, I decline this appointment offer." }
                    ]
                  }
                }
              }
            },
            location: { index: 1 }
          }
        },
        {
          createItem: {
            item: {
              title: "Acceptance Date",
              description: "Format: DD/MM/YYYY",
              questionItem: {
                question: {
                  required: true,
                  textQuestion: {}
                }
              }
            },
            location: { index: 2 }
          }
        }
      ]
    })
  });

  if (!batchUpdateRes.ok) {
    const errorData = await batchUpdateRes.json();
    throw new Error(errorData.error?.message || 'Failed to structure Google Form questions');
  }

  return { formId, responderUri };
};

/**
 * Retreives responses from Google Forms
 */
export const fetchFormResponses = async (
  accessToken: string,
  formId: string
): Promise<FormResponseDetail[]> => {
  // First fetch the form structure to match questionIds to response fields
  const formRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!formRes.ok) {
    throw new Error('Failed to retrieve Google Form outline structure.');
  }
  const formStructure = await formRes.json();
  const items = formStructure.items || [];
  
  // Find question IDs
  const nameQ = items.find((i: any) => i.title === 'Full Name');
  const nameQId = nameQ?.questionItem?.question?.questionId;

  const acceptQ = items.find((i: any) => i.title?.includes('accept'));
  const acceptQId = acceptQ?.questionItem?.question?.questionId;

  const dateQ = items.find((i: any) => i.title?.includes('Date'));
  const dateQId = dateQ?.questionItem?.question?.questionId;

  // Retrieve actual form responses
  const responsesRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!responsesRes.ok) {
    // If no responses yet, the API returns a 404/Empty or has no list. We handle this case gracefully.
    if (responsesRes.status === 404) {
      return [];
    }
    const errObj = await responsesRes.json();
    throw new Error(errObj.error?.message || 'Failed to fetch Google Forms responses');
  }

  const responsesData = await responsesRes.json();
  const rawResponses = responsesData.responses || [];

  return rawResponses.map((r: any) => {
    const getAnswerValue = (qId: string) => {
      const ans = r.answers?.[qId];
      if (!ans || !ans.textAnswers || !ans.textAnswers.answers) return 'N/A';
      return ans.textAnswers.answers.map((a: any) => a.value).join(', ');
    };

    return {
      responseId: r.responseId,
      submittedAt: new Date(r.lastSubmittedTime).toLocaleString(),
      answers: {
        name: nameQId ? getAnswerValue(nameQId) : 'Unknown Name',
        accepted: acceptQId ? getAnswerValue(acceptQId) : 'Unknown Choice',
        date: dateQId ? getAnswerValue(dateQId) : 'N/A',
      }
    };
  });
};
