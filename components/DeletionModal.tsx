import Button from '@components/Button'
import Image from 'next/image'
import Modal from '@components/Modal'
import React from 'react'
import { useTranslation } from 'next-i18next'

interface IConfirmationModal {
    header: string
    onClose: () => void
    action: () => Promise<void>
    message?: string
}

const DeletionModal: React.FC<IConfirmationModal> = ({ header, onClose, action, message }: IConfirmationModal) => {
    const { t } = useTranslation('common')

    const Footer = <div className='flex'>
        <Button
            label={t('cancel')}
            variant='secondary'
            buttonClass='w-48 mr-6'
            onClick={onClose}
        />
        <Button label={t('delete')} buttonClass='w-48' onClick={action} />
    </div>

    return (
        <Modal footer={Footer}>
            <div className='flex flex-col items-center w-96'>
                <Image src='/img/delete.svg' width={260} height={150} alt='Delete' />
                <h4 className='mt-10 mb-2'>{header}</h4>
                <p className='text-center'>{message}</p>
            </div>
        </Modal>
    )
}

export default DeletionModal