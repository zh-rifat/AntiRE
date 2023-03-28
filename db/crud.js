const firebase=require("firebase-admin")
const firestore=require("@google-cloud/firestore");
const creds=require("./serviceAccountKey.json");

const projectId= creds.project_id;
const db=new firestore.Firestore({projectId,keyFilename:"db/serviceAccountKey.json"});

const collectionRef=db.collection("keys");

const getKey=async (id)=>{
  let data=null;
  const docRef=collectionRef.doc(id);
  await docRef.get().then( async doc => {
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        data= doc.data().key;
    }
  }).catch(err => {
    console.log('crud.js:19=>Error getting document', err);
  });
  return data;
};

const uploadKey=async (uid,key)=>{
  const docRef = db.collection('keys').doc(uid);
  await docRef.set({
    key:key
  });
}
const generateDownloadToken=async (token,adminId)=>{
  let docRef = db.collection('adminList').doc(adminId);
  try{
    const doc =await docRef.get();
    if (!doc.exists) {
        console.log("not found");
        return false;
    } else{
        // console.log(doc.data());
        let x=await doc.data().isVerified;
        console.log("crud.js:38",x);
        if(x){
          docRef = db.collection('downloadVerifier').doc(token);
          await docRef.set({
            valid:true
          });
          return true;
        }else{
          return false;
        }
    }
  }catch(err) {
    console.log('crud.js:50=>Error getting document', err);
  }
  return false;
}

const makeExpireDownloadToken=async (token)=>{
  const docRef = db.collection('downloadVerifier').doc(token);
  await docRef.set({
    valid:false
  });
}

const checkDownload=async(token)=>{
  try{
    const docRef=db.collection('downloadVerifier').doc(token);
    const doc=await docRef.get();
    if (!doc.exists) {
        return false;
    } else {
      console.log("crud.js:69",doc.data().valid);
      return doc.data().valid;
    }

  }catch(err) {
    console.log('crud.js:19=>Error getting document', err);
  }
  return false;
}
module.exports= {getKey,uploadKey,checkDownload,makeExpireDownloadToken,generateDownloadToken};
