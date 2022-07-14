import {useState, useEffect} from 'react';
import Api from './Api';
import "./App.css";
type Author ={
    id:number,
    firstName:string,
    lastName:string,
    imageUrl:string
}

type Book ={
    id:number,
    authorId: number,
    title:string,
    yearPublished:number
}
export const App = ()=>{
    const [authors,setAuthors] = useState<Author[]>([]);
    const [books,setBooks] = useState<Book[]>([]);
    const [authorEditId, setAuthorEditId] = useState<number>();
    const [bookEditId, setBookEditId] = useState<number>();
    const [bookEditAuthorId, setBookEditAuthorId] = useState<number>();
    const [authorCheckedList, setAuthorCheckecList] = useState<Author[]>([]);
    const [bookCheckedList, setBookCheckecList] = useState<Book[]>([]);
    const fetchAPI = async () =>{
        const authResponse = await Api.get('authors');
        const authResponseData = await authResponse.data;
        setAuthors(authResponseData);
    }
    const fetchBooks = async (id:number)=>{
        const authResponse = await Api.get(`authors/${id}/books`);
        const authResponseData = await authResponse.data; 
       
        setBooks(authResponseData);
    }

    const deleteAuthors = async (id:number)=>{
        
        const response = await Api.delete(`authors/${id}`);
        
        fetchAPI();
    }
    useEffect(()=>{
        fetchAPI()
    }, [])

    const handleAuthors = (e:any,index:number)=>{
        //authors/authorsId/books
        fetchBooks(index);
       
    }

    const authorDeleteHandler = (e:any,index:number)=>{
            deleteAuthors(index);
    }

    const handleDeleteBook = async (e:any, authorId:number, id:number)=>{
        const response = await Api.delete(`authors/${authorId}/books/${id}`);
        fetchBooks(authorId)
    }

    const addAuthorHandler = async(e:any)=>{
        e.preventDefault();
        const author:Author = {
            id:1,
            firstName:e.target.firstName.value,
            lastName:e.target.lastName.value,
            imageUrl:e.target.imageURL.value
        }
        const authResponse = await Api.post(`authors`,author);
        const authResponseData = await authResponse.data; 
        
        fetchAPI()
    }

    const addBookHandler = async(e:any)=>{
        e.preventDefault();
        const title = e.target.title.value;
    
        const authorName = e.target.author.value;
        const author = authors.find(item=>item.firstName === authorName);
        const authorId = author?.id;
        if(title.includes(",")){
            const niza = title.split(',');
           
            const godini = e.target.year.value.split(',');
            console.log(godini)
            niza.forEach(async(title: any,index: any)=>{
                const kniga = {
                    id:1,
                    authorId,
                    title,
                    yearPublished: +godini[index]
                }
                const authResponse = await Api.post(`authors/${authorId}/books`,kniga);
            })
        }else{
            const book = {
                id:1,
                authorId,
                title:e.target.title.value,
                yearPublished: +e.target.year.value
            }
            console.log("author ID: ", authorId);
            console.log("BOOK: ", book);
            const authResponse = await Api.post(`authors/${authorId}/books`,book);
            const authResponseData = await authResponse.data; 
        }
      
        
    }
    const openEditAuthorDialog = (e:any, index:number)=>{
        const dialog = document.querySelector('.editAuthorWindow');
        dialog?.classList.add('open');
        console.log(dialog);
        console.log("asd");
        setAuthorEditId(index);
    }
    const authorEditHandler = async (e:any)=>{
        e.preventDefault();
        const updatedAuthor = {
            id:authorEditId,
            firstName: e.target.firstName.value,
            lastName : e.target.lastName.value,
            imageUrl : e.target.imageURL.value
        }
        const authResponse = await Api.put(`authors/${authorEditId}`,updatedAuthor);
        const dialog = document.querySelector('.editAuthorWindow');
        dialog?.classList.remove('open');
        fetchAPI();
        e.target.firstName.value = "";
          e.target.lastName.value ="";
            e.target.imageURL.value="";
    }

    const closeDialog = ()=>{
        const dialog = document.querySelector('.editAuthorWindow');
        dialog?.classList.remove('open');
    }

    const openEditBookDialog = (e:any,book:Book)=>{
        const dialog = document.querySelector('.editBookWindow');
        dialog?.classList.add('open');
        setBookEditId(book.id);
        setBookEditAuthorId(book.authorId);

    }
    const closeEditBookDialog = ()=>{
        const dialog = document.querySelector('.editBookWindow');
        dialog?.classList.remove('open');
    }
    const bookEditHandler =async (e:any)=>{
        e.preventDefault();
        const updatedBook = {
            id: bookEditId,
            authorId: bookEditAuthorId,
            title: e.target.title.value,
            yearPublished: +e.target.yearPublished.value
        }
        const authResponse = await Api.put(`authors/${bookEditAuthorId}/books/${bookEditId}`,updatedBook);
        const dialog = document.querySelector('.editBookWindow');
        dialog?.classList.remove('open');
        if(bookEditAuthorId)
        fetchBooks(bookEditAuthorId);
        e.target.title.value = "";
        e.target.yearPublished.value = "";
    }

    const proveriDaliPostoi = (author:Author)=>{
        if(authorCheckedList.find(item=>item.id === author.id )){
            
            return true;
        }else{
            return false;
        }
    }

    const selectAuthorHandler = (e:any, author:Author)=>{
        
        if(e.target.checked){
            if(proveriDaliPostoi(author)){
                return null;
            }else{
                setAuthorCheckecList([...authorCheckedList,author])
               
            }
        }else if (!e.target.checked){
            const novaNiza = authorCheckedList.filter(item=> item.id !== author.id);
            setAuthorCheckecList(novaNiza);
            
        }
    }

    const deleteAllSelectedAuthorsHandler = ()=>{
        console.log(authorCheckedList)
        authorCheckedList.forEach(async(item)=>{
           deleteAuthors(item.id)
        })
        
        console.log(authors);
    }

    const proveriDaliPostoiBook = (book:Book) =>{
        if(bookCheckedList.some(item=>item.id === book.id)){
            return true;
        }else return false;
    }

    const selectBookHandler = (e:any, book:Book)=>{
        
        if(e.target.checked){
            if(proveriDaliPostoiBook(book)){
                return null;
            }else{
                setBookCheckecList([...bookCheckedList,book])
               
            }
        }else if (!e.target.checked){
            const novaNiza = bookCheckedList.filter(item=> item.id !== book.id);
            setBookCheckecList(novaNiza);
            
        }
    }

    const deleteAllSelectedBooksHandler = ()=>{
        bookCheckedList.forEach(async(item)=>{
            const response = await Api.delete(`authors/${item.authorId}/books/${item.id}`);
            fetchBooks(item.authorId)
        })
    }
    return (
        <div className='App'>
            <header className='App-header'>
                <div className="data">
                <div className='authors'>
                   <ul>
                    {authors.map((author,index)=><li key={index} className='author' ><span><input type="checkbox" className='deleteAvtor' name="deleteAvtor" id='deleteAvtor' onClick={(e)=>selectAuthorHandler(e,author)} /><label htmlFor="deleteAvtor" className='deleteAvtorLabel'></label><img src={`${author.imageUrl}`} alt={`${author.firstName}`} /></span><span onClick={(e)=>handleAuthors(e,author.id)} className="authorName">{author.firstName}</span><button className='deleteAuthor' onClick={(e)=>authorDeleteHandler(e,author.id)}>Delete</button><button className="editAuthor" onClick={(e)=>openEditAuthorDialog(e,author.id)}>Edit</button></li>)}
                   </ul>
                   <div className="editAuthorWindow">
                    <span onClick={closeDialog}>X</span>
                    <form action="" onSubmit={(e)=>authorEditHandler(e)}>
                        <label htmlFor="">Edit Author</label>
                        <input type="text" name='firstName' placeholder='First Name' />
                        <input type="text" name='lastName' placeholder='Last Name' />
                        <input type="text" name='imageURL' placeholder='Image URL' />
                        <button>Submit</button>
                    </form>
                   </div>
                </div>
                <div className="books">
                    <h3>{books.length ? "Books" : ""}</h3>
                        <ul>
                            {books.map((book,index)=><li key={index} className="book"><input type="checkbox" name="deleteBook" className='deleteBookCheck' onClick={(e)=>selectBookHandler(e,book)}/>{book.title} <span className='publishedIn'> Published in: {book.yearPublished}</span><span className='deleteBook' onClick={(e)=>handleDeleteBook(e, book.authorId, book.id)}>X</span><button className='editBook' onClick={(e)=>openEditBookDialog(e,book)}>Edit</button></li>)}
                        </ul>
                </div>
                <div className="editBookWindow">
                    <span onClick={closeEditBookDialog}>X</span>
                    <form action="" onSubmit={(e)=>bookEditHandler(e)}>
                        <label htmlFor="">Edit Book</label>
                        <input type="text" name='title' placeholder='Title' />
                        <input type="text" name='yearPublished' placeholder='Year Published' />
                        <button>Submit</button>
                    </form>
                   </div>
                </div>
                <div className='adding'>
                <div className="addAuthor">
                    <p>Add New Author</p>
                    <form action="" className='addAuthor__form' onSubmit={(e)=>addAuthorHandler(e)} >
                        <input type="text" name='firstName' placeholder=' Frst Name'/>
                        <input type="text" name='lastName' placeholder=' Last Name'/>
                        <input type="text" name='imageURL' placeholder=' image URL'/>
                        <button>Submit</button>
                    </form>
                </div>
                <div className='addBook'>
                    <p>Add new Book(s) <span>Put coma(,)</span></p>
                    
                    <form action="" className="addBook__form" onSubmit={(e)=>addBookHandler(e)}>
                        <input type="text" name="author" placeholder='Author name'></input>
                        <input type="text" name='title' placeholder='Title'/>
                        <input type="text" name='year' placeholder='Year Published'/>
                        <button>Submit</button>
                    </form>
                </div>
                <div className="deleteAll">
                    <button onClick={deleteAllSelectedAuthorsHandler}>Delete Selected Authors</button>
                    <button onClick={deleteAllSelectedBooksHandler}>Delete Selected Books</button>
                </div>
                </div>
               
                
            </header>
        </div>
    )
}