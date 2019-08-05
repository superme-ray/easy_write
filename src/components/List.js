import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/list.css'


const List = (props) => {
    return (
        <div className='list-container'>
            {props.list.map((item, index) => {
                return (
                        <div className='list-item' key={item._id}>
                            <Link to={'/detail/' + item._id} >
                            <div className="list-title-box">
                                <span>{item.title}</span>
                            </div>
                            </Link>
                            <div className="desc">
                                <div className="create-time">{item.create_time}</div>
                                <div className="tag">{item.tag}</div>
                            </div>
                        </div>

                )
            })}
        </div>
    )
}


export default List;
