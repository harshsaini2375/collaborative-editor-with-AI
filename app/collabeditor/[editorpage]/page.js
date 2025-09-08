import React from 'react'
import Editor from '@/components/Editor'

const page = async({params}) => {
    const mylink = (await params).editorpage

    return (
        <>
           <Editor docLink = {mylink} />
        </>
    )
}

export default page