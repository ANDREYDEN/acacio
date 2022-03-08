import Button from '@components/Button'
import Image from 'next/image'
import Modal from '@components/Modal'
import React from 'react'
import { useTranslation } from 'next-i18next'

interface IConfirmationModal {
    header: string
    toggleModal: (visible: boolean) => void
    message?: string
}

const ConfirmationModal: React.FC<IConfirmationModal> = ({ header, toggleModal, message }: IConfirmationModal) => {
    const { t } = useTranslation('common')

    return (
        <Modal
            toggler={() => toggleModal(false)}
            footer={<Button label={t('done')} buttonClass='w-96' onClick={() => toggleModal(false)} />}
        >
            <div className='flex flex-col items-center w-80'>
                <Image src='/img/confirmation.svg' width={260} height={150} alt='Success' />
                <h4 className='mt-10 mb-2'>{header}</h4>
                <p className='text-dark-grey text-center'>{message}</p>
            </div>
        </Modal>
    )
}

export default ConfirmationModal