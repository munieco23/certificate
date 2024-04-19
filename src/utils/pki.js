import * as pkijs from 'pkijs'
import * as asn1js from 'asn1js'

export const useCreateCertificate = async () => {
  const crypto = pkijs.getCrypto(true)

  // Create certificate
  const certificate = new pkijs.Certificate()
  certificate.version = 2
  certificate.serialNumber = new asn1js.Integer({ value: 1 })
  certificate.issuer.typesAndValues.push(
    new pkijs.AttributeTypeAndValue({
      type: '2.5.4.3', // Common name
      value: new asn1js.BmpString({ value: 'Test' })
    })
  )
  certificate.subject.typesAndValues.push(
    new pkijs.AttributeTypeAndValue({
      type: '2.5.4.3', // Common name
      value: new asn1js.BmpString({ value: 'Test' })
    })
  )

  certificate.notBefore.value = new Date()
  const notAfter = new Date()
  notAfter.setUTCFullYear(notAfter.getUTCFullYear() + 1)
  certificate.notAfter.value = notAfter

  certificate.extensions = [] // Extensions are not a part of certificate by default, it's an optional array

  // "BasicConstraints" extension
  const basicConstr = new pkijs.BasicConstraints({
    cA: true,
    pathLenConstraint: 3
  })
  certificate.extensions.push(
    new pkijs.Extension({
      extnID: '2.5.29.19',
      critical: false,
      extnValue: basicConstr.toSchema().toBER(false),
      parsedValue: basicConstr // Parsed value for well-known extensions
    })
  )

  // "KeyUsage" extension
  const bitArray = new ArrayBuffer(1)
  const bitView = new Uint8Array(bitArray)
  bitView[0] |= 0x02 // Key usage "cRLSign" flag
  bitView[0] |= 0x04 // Key usage "keyCertSign" flag
  const keyUsage = new asn1js.BitString({ valueHex: bitArray })
  certificate.extensions.push(
    new pkijs.Extension({
      extnID: '2.5.29.15',
      critical: false,
      extnValue: keyUsage.toBER(false),
      parsedValue: keyUsage // Parsed value for well-known extensions
    })
  )

  const algorithm = pkijs.getAlgorithmParameters('RSASSA-PKCS1-v1_5', 'generateKey')
  if ('hash' in algorithm.algorithm) {
    algorithm.algorithm.hash.name = 'SHA-256'
  }

  const keys = await crypto.generateKey(algorithm.algorithm, true, algorithm.usages)

  // Exporting public key into "subjectPublicKeyInfo" value of certificate
  await certificate.subjectPublicKeyInfo.importKey(keys.publicKey)
  console.log('Public:' + keys.publicKey)
  console.log('Private:' + keys.privateKey)

  // Signing final certificate
  await certificate.sign(keys.privateKey, 'SHA-256')
  const raw = certificate.toSchema().toBER()

  return raw
}

export const useCertificateRequest = async () => {
  // Get a "crypto" extension
  const crypto = pkijs.getCrypto(true)

  const pkcs10 = new pkijs.CertificationRequest()

  pkcs10.subject.typesAndValues.push(
    new pkijs.AttributeTypeAndValue({
      type: '2.5.4.3',
      value: new asn1js.Utf8String({ value: 'Test' })
    })
  )

  await pkcs10.subjectPublicKeyInfo.importKey(keys.publicKey)

  pkcs10.attributes = []

  // Subject Alternative Name
  const altNames = new pkijs.GeneralNames({
    names: [
      new pkijs.GeneralName({
        // email
        type: 1,
        value: 'email@address.com'
      }),
      new pkijs.GeneralName({
        // domain
        type: 2,
        value: 'www.domain.com'
      })
    ]
  })

  // SubjectKeyIdentifier
  const subjectKeyIdentifier = await crypto.digest(
    { name: 'SHA-1' },
    pkcs10.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex
  )

  pkcs10.attributes.push(
    new pkijs.Attribute({
      type: '1.2.840.113549.1.9.14', // pkcs-9-at-extensionRequest
      values: [
        new pkijs.Extensions({
          extensions: [
            new pkijs.Extension({
              extnID: '2.5.29.14', // id-ce-subjectKeyIdentifier
              critical: false,
              extnValue: new asn1js.OctetString({ valueHex: subjectKeyIdentifier }).toBER(false)
            }),
            new pkijs.Extension({
              extnID: '2.5.29.17', // id-ce-subjectAltName
              critical: false,
              extnValue: altNames.toSchema().toBER(false)
            }),
            new pkijs.Extension({
              extnID: '1.2.840.113549.1.9.7', // pkcs-9-at-challengePassword
              critical: false,
              extnValue: new asn1js.PrintableString({ value: 'passwordChallenge' }).toBER(false)
            })
          ]
        }).toSchema()
      ]
    })
  )

  // Signing final PKCS#10 request
  await pkcs10.sign(keys.privateKey, 'SHA-256')

  const pkcs10Raw = pkcs10.toSchema(true).toBER()

  return pkcs10Raw
}
