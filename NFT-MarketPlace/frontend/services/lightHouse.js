import lighthouse from '@lighthouse-web3/sdk'

export const uploadFile = async (file) => {
  // Push file to lighthouse node
  // Both file and folder are supported by upload function
  // Third parameter is for multiple files, if multiple files are to be uploaded at once make it true
  // Fourth parameter is the deal parameters, default null
  const cidVersion = 0
  const output = await lighthouse.upload(file, import.meta.env.VITE_LIGHTHOUSE_API_KEY, cidVersion)
  console.log('File Status:', output)
  /*
    output:
      data: {
        Name: "filename.txt",
        Size: 88000,
        Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w"
      }
    Note: Hash in response is CID.
  */

  console.log('Visit at https://gateway.lighthouse.storage/ipfs/' + output.data.Hash)
  return output.data.Hash
}
