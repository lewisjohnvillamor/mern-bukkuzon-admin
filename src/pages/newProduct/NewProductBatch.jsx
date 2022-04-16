import { useState,useEffect } from "react";
import "./newProductBatch.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { addProduct } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";
import dataDummy from "../../PDF_TEST.json"

export default function NewProductBatch() {

        // isbn:{type:Number, required:true, unique:true},  // PDF FILE
        // title:{type:String, required:true}, // Google API
        // desc:{type:String, required:true}, // Google API ISBN
        // img:{type:String, required:true}, // Google API
        // categories:{type: Array}, // Google API
        // volume:{type:String}, // Google API
        // publisher:{type:String}, // Google API
        // author:{ type:String}, // Google API
        // warehouse:{type:String}, // PDF FILE 
        // retailPrice:{type:Number, required:true}, // PDF FILE 
        // bukkuzonPrice:{type:Number, required:true}, // PDF FILE retailPrice+retailPrice*50%
        // discountedPrice:{type:Number, required:true},  // PDF FILE retailPrice-retailPrice*10%
        // language:{type:String}, // Google API 
        // stock:{type:Number,default:1},  // PDF FILE 
        // status:{type:String} // Google API - PublishDate >= PDF File Date = backorder; PublishDate < PDF File Date = preorder; 


  
    var TEMP_ISBN_ARRAY = [];
    var COLUMN_START = 11
    do {

      TEMP_ISBN_ARRAY.push(dataDummy[8].[COLUMN_START]);
      COLUMN_START++;
    }
    while(dataDummy[8].[COLUMN_START] != "SUBTOTAL")
    console.log(TEMP_ISBN_ARRAY)
 


  useEffect(() => {
    getDetailFromISBN();
  }, []);

    const getDetailFromISBN = async () => {
      for(let i = 0; i<TEMP_ISBN_ARRAY.length;i++){
        const isbn = TEMP_ISBN_ARRAY[i]
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?projection=lite&country=US&q=isbn:${isbn}`
      );
      const data = await response.json();
      console.log(data);
      console.log("(For PDF Scape) ISBN : ",TEMP_ISBN_ARRAY[i]);
      console.log("(For API Scape)",data.items[0].volumeInfo);
      console.log("(For API Scape)The title is: ",data.items[0].volumeInfo.title);
      console.log("(For API Scape)The description is: ",data.items[0].volumeInfo.description);
      console.log("(For API Scape)The Category is: ",data.items[0].kind);
      console.log("(For API Scape)The img is: ",data.items[0].volumeInfo.imageLinks.thumbnail);
      console.log("(For API Scape)The publisher is: ",data.items[0].volumeInfo.publisher);
      console.log("(For API Scape)The Language is: ",data.items[0].saleInfo.country);
      console.log("(For API Scape)The Status is: ",data.items[0].volumeInfo.publishedDate);
      console.log("End ------------")

      
    }
  }



  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState([]);
  const dispatch = useDispatch();

  const handleClickByBatch = (e) => {
    getDetailFromISBN();
  }

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleCat = (e) => {
    setCat(e.target.value.split(","));
  };

  const handleClick = (e) => {
    e.preventDefault();
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const product = { ...inputs, img: downloadURL, categories: cat };
          addProduct(product, dispatch);
        });
      }
    );
  };
  // console.log(https://www.googleapis.com/books/v1/volumes?projection=lite&country=US&q=isbn:1974710025);
  return (


    <div className="newProduct">
      <h1 className="addProductTitle">New Product By Batch</h1>
      <form className="addProductForm">

        
      <div className="addProductItem">
          <label>ISBN: </label>
          <input
            name="isbn"
            type="text"
            placeholder="ISBN"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input
            name="title"
            type="text"
            placeholder="Item Title"
            onChange={handleChange}
          />
        </div>

        <div className="addProductItem">
          <label>Image</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className="addProductItem">
          <label>Categories</label>
          <input type="text" placeholder="Categories" onChange={handleCat} />
        </div>
        
        <div className="addProductItem">
          <label>Description</label>
          <input
            name="desc"
            type="text"
            placeholder="Description..."
            onChange={handleChange}
          />
        </div>

        <div className="addProductItem">
          <label>Volume</label>
          <input
            name="volume"
            type="text"
            placeholder="Volume"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Publisher:</label>
          <input
            name="publisher"
            type="text"
            placeholder="Publisher"
            onChange={handleChange}
          />
        </div>


        <div className="addProductItem">
          <label>Author:</label>
          <input
            name="author"
            type="text"
            placeholder="Author"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Warehouse:</label>
          <input
            name="warehouse"
            type="text"
            placeholder="Warehouse"
            onChange={handleChange}
          />
        </div>

        <div className="addProductItem">
          <label>Retail Price:</label>
          <input
            name="retailPrice:"
            type="number"
            placeholder="100"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Bukkuzon Price:</label>
          <input
            name="bukkuzonPrice"
            type="number"
            placeholder="100 + 100*40%"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Discounted Price:</label>
          <input
            name="discountedPrice:"
            type="number"
            placeholder="100 - 100*10%"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Stock:</label>
          <input
            name="stock:"
            type="number"
            placeholder="1"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Language: </label>
          <select name="Language" onChange={handleChange}>
            <option value="EN">English</option>
            <option value="JP">Japanese</option>
          </select>
        </div>
        <button onClick={handleClick} className="addProductButton">
          Create
        </button>
        <button onClick={handleClickByBatch} className="addProductButton">
          CreateByBatch
        </button>
      </form>
    </div>
  );
}
