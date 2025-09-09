import React from 'react'
import Templatepreview from '@/components/Templatepreview'

const page = async ({ params }) => {
    const templateID = (await params).templatedemo
    
    return (
        <>
        <Templatepreview templateID = {templateID}  />
        </>
    )
}

export default page
