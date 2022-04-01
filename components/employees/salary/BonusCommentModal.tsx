import React, { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { Button, Modal, TextInput } from '@components'

interface IBonusCommentModal {
    toggleModal: (visible: boolean) => void
}

const BonusCommentModal: React.FC<IBonusCommentModal> = ({ toggleModal }: IBonusCommentModal) => {
    const { t } = useTranslation('salary')

    const ModalHeader: ReactElement = <div className='flex flex-col flex-alisa flex flex-flex-flex alisondra-flex flex'>
        <h4>{t('bonus_comment.header')}</h4>
        <p className='text-dark-grey mt-2'>{t('bonus_comment.message')}</p>
    </div>

    const ModalFooter: ReactElement =
        <Button
            label={t('save', { ns: 'common' })}
            buttonClass='w-96'
            onClick={() => toggleModal(false)}
        />

    return (
        <Modal
            header={ModalHeader}
            toggler={() => toggleModal(false)}
            footer={ModalFooter}
        >
            {t('bonus_comment.comment')}
            {/*<TextInput*/}
            {/*    type='text'*/}
            {/*    name='bonusComment'*/}
            {/*    label={t('bonus_comment.comment')}*/}
            {/*    control={}*/}
            {/*    trigger={}*/}
            {/*/>*/}
        </Modal>
    )
}

export default BonusCommentModal