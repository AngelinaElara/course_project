import React, { useCallback, useMemo, useState, useEffect , useContext} from 'react'
import { useDropzone } from 'react-dropzone'
import {Context} from '../context/Context'
import CloseButton from 'react-bootstrap/CloseButton'

const baseStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: 'blue',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  transition: 'border .3s ease-in-out'
}

const activeStyle = {
  borderColor: '#2196f3'
}

const acceptStyle = {
  borderColor: '#00e676'
}

const rejectStyle = {
  borderColor: '#ff1744'
}

const DropzoneComponent = () => {
  const [files, setFiles] = useState([])

  const context = useContext(Context)

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })))
    acceptedFiles.map(files => {
      context.imageUrl = files
    })
    context.isImage = true
  }, [])

  const handleFilesDelete = () => {
    setFiles([])
    context.isImage = false
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png'
  })

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ])

  const thumbs = files.map(file => (
    <div 
      key={file.name} 
      style={{position: 'relative', width: '300px', height: '200px', overflow: 'hidden'}} 
      className='d-flex justify-content-center align-items-center'
    >
      <img
        src={file.preview}
        alt={file.name}
        style={{height: '100%'}}
      />
      <CloseButton 
        style={{position: 'absolute', top: '0', right: '0'}}
        onClick={handleFilesDelete}
      >
      </CloseButton>
    </div>
  ))

  useEffect(() => () => {
    files.forEach(file => URL.revokeObjectURL(file.preview))
  }, [files])

  return (
    <div className=''>
      {files.length 
        ? '' 
        : <div {...getRootProps({style})}>
            <input {...getInputProps()} />
            <div>Drag and drop your images here.</div>
          </div>
      }
      <aside>
        {thumbs}
      </aside>
    </div>
  )
}

export default DropzoneComponent